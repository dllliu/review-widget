from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from flask import render_template, request   #facilitate jinja templating
from flask import session, redirect, url_for, make_response        #facilitate form submission
from inference import get_product_and_description_from_url, get_questions_for_product, categorize_review, categorize_question, extract_main_domain
import uuid
from database_functions import *
import time
import json
from datetime import datetime

app = Flask(__name__) 
app.secret_key = os.urandom(32)
CORS(app)
#client

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/api/test", methods=['GET'])
def test():
    print(get_product_and_description_from_url("https://kith.com/products/kht030146-101"))
    return jsonify(get_product_and_description_from_url("https://kith.com/products/kht030146-101"))

@app.route('/get_product_info_from_url', methods=['POST'])
def receive_url():
    data = request.get_json()  # Parse JSON data from the request
    url = data.get('url')  # Extract the URL
    print(f"Received URL: {url}")

    if find_products_by_url(url):
        return find_products_by_url(url)
    else:
        return jsonify(get_product_and_description_from_url(url))

@app.route('/find_reviews_from_url', methods=['POST'])
def find_reviews_from_url():
    data = request.get_json()  # Parse JSON data from the request
    url = data.get('url')  # Extract the URL
    print(find_reviews_by_url(url))
    return find_reviews_by_url(url)


@app.route('/get_product_questions', methods=['POST'])
def get_product_questions():
    data = request.get_json()  # Parse JSON data from the request
    url = data.get('url')  # Extract the URL

    if find_products_by_url(url):
        return find_products_by_url(url)[0]

    product_and_questions = get_questions_for_product(get_product_and_description_from_url(url))
    return product_and_questions

# reviews: id, created_at, url, review, rating, category, hostSite
@app.route("/submit_review", methods=['POST'])
def submit_review():
    try:
        # Get the JSON data from the request body
        data = request.get_json()

        # Extract data from the JSON payload
        product_url = data.get('url')
        review = data.get('review')
        rating = data.get('rating')

        # Print out the received data for debugging
        print(f"Product URL: {product_url}")
        print(f"Review: {review}")
        print(f"Rating: {rating}")

        # Create a review document
        review_document = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "url": product_url,
            "review": review,
            "rating": rating,
            "category": categorize_review(review, ["durability", "price", "accessibility", "versatility"]), #"test"
            "hostSite": extract_main_domain(product_url)
        }

        print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

        # Insert the review into the database
        res = insert_into_review_table(review_document)

        if not res:
            return jsonify({"message": "Review submitted successfully"}), 200
        else:
            return jsonify({"error": str(res)}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/question_query', methods=['POST'])
def review_query():
    data = request.get_json()
    question = data.get('question')
    question_category = categorize_question(question, ["durability", "price", "accessibility", "versatility"])
    res = select_table_contents(REVIEW_TABLE, "*", "category", question_category)
    print(question)
    print(question_category)
    print(res)
    return res

@app.route("/delete_review", methods=['POST'])
def delete_review():
    data = request.get_json()
    review_id = data.get("reviewId")
    if delete_review_by_id(review_id):
        print(review_id)
        print(delete_review_by_id(review_id))
        return jsonify({"message": "Review deleted successfully"}), 200
    return jsonify({"message": "Error in deleting review"}), 500

@app.route('/edit_review', methods=['POST'])
def edit_review():
    try:
        data = request.get_json()

        review_id = data.get('reviewId')
        updated_review = data.get('newText')
        updated_rating = data.get('newRating')

        # Print out the received data for debugging
        print(f"Review ID: {review_id}")
        print(f"Updated Review: {updated_review}")
        print(f"Updated Rating: {updated_rating}")

        # keep in mind timestamp and other details
        # updated_review_document = {
        #     "review": updated_review,
        #     "rating": updated_rating,
        #     "category": categorize_review(updated_review, ["durability", "price", "accessibility", "versatility"])
        # }

        # Update the review in the database
        res = edit_review_db(review_id, updated_review, updated_rating)

        if res:
            return jsonify({"success": "true"}), 200
        else:
            return jsonify({"error": str(res)}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)