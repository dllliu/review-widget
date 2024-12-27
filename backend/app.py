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

# from product import insert_if_not_exists, find_by_url 
# from inference import enhance_question, categorize_review, categorize_question
# from vector_metrics import query_for_embedding

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
    
    #return jsonify({"status": "success", "url_received": url})
    print(jsonify(get_product_and_description_from_url(url)))
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
    product_and_questions = get_questions_for_product(get_product_and_description_from_url(url))
    print(product_and_questions)
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
            "category": "test",  # You can categorize the review if needed
            "hostSite": extract_main_domain(product_url)
        }

        # Insert the review into the database
        res = insert_into_review_table(review_document)

        if not res:
            return jsonify({"message": "Review submitted successfully"}), 200
        else:
            return jsonify({"error": str(res)}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # try:
    #     product_url = request.form['url']
    #     print(product_url)
    #     review = request.form['review']
    #     print(review)
    #     rating = request.form['rating']
    #     print(rating)
    #     review_document = {
    #         "id": str(uuid.uuid4()),
    #         "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    #         "url": product_url,
    #         "review": review,
    #         "rating": rating,
    #         "category": "test", #categorize_review(review, ["durability", "price", "accessibility", "versatility"]),
    #         "hostSite": extract_main_domain(product_url)
    #     }
    #     res = insert_into_review_table(review_document)
    #     if not res:
    #         return render_template("error.html", response = "Review submitted successfully")
    #     return render_template("error.html", error=str(res))
    # except Exception as e:
    #     return render_template("error.html", error = str(e))
    
@app.route("/review_question")
def review_quesion(): 
    return render_template("question.html")

@app.route("/search_results")
def search_results_for_question():
    return render_template("review_aggregation.html")

@app.route("/look_reviews")
def look_reviews():
    return render_template("review_aggregation.html")

# @app.route('/url_receiver', methods=['POST'])
# def handle_url():
#     data = request.get_json()  # Parse the JSON data sent by the extension
#     current_url = data.get('current_url')  # Get the current URL from the request
#     print(f"Received URL: {current_url}")
    
#     return jsonify({"message": "URL received successfully", "received_url": current_url})

# @app.route("/submit_review")
# def submit_review(): 
#     pass
#     #return render_template("index.html")

# @app.route('/process_product', methods=['POST'])
# def process_product():
    
#     """Process the product URL: scrape if not in DB, then retrieve and return questions."""
#     data = request.json
#     product_url = data

#     if not product_url:
#         return jsonify({"error": "No URL provided"}), 400

#     try:
#         # Step 1: Connect to Mongo
#         if client is None:
#             return jsonify({"error": "Failed to connect to MongoDB"}), 500
#         # Step 2: Check if the product already exists in MongoDB
#         existing_product = find_by_url(client, 'review-db', 'products', product_url)

#         if existing_product is None:
#             # Step 3: scrape product and description
#             prod_entry = get_product_and_description_from_url(product_url)
#             if not prod_entry:
#                 return jsonify({"error": "Failed to scrape product info"}), 500

#             # Step 4: Use AI to generate additional info
#             document = get_questions_for_product(prod_entry)

#             # Step 5: Insert the new product into MongoDB
#             # insert_result, insert_status_code = insert_if_not_exists(client, 'review-db', 'products', document)
#             # if insert_status_code != 201:
#             #     return jsonify({"error": "Failed to insert new product"}), 500
#             insert_if_not_exists(client, 'review-db', 'products', document)

#         # Step 7: Retrieve the product again (whether it was inserted or already existed)
#         product = find_by_url(client, 'review-db', 'products', product_url)
#         # if produc or 'questions' not in product:
#         #     return jsonify({"error": "Product not found or no questions available"}), 500

#         # Step 8: Extract the first 3 questions using keys like q1, q2, q3
#         questions_field = product.get('questions', {})
#         questions = [questions_field.get(f'q{i}') for i in range(1, 4) if questions_field.get(f'q{i}')]

#         return jsonify({"questions": questions})

#     except Exception as e:
#         print(f"Error processing the product: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/submit_review', methods=['POST', 'OPTIONS'])
# def submit_review():
#     if request.method == 'OPTIONS':
#         # Handle the preflight OPTIONS request
#          return '', 200  # Respond with 200 OK for the preflight request
#     """Receive URL, review, rating; generate review embedding, and insert into MongoDB."""
#     data = request.json
#     product_url = data.get('url')
#     review = data.get('review')
#     rating = data.get('rating')

#     if not product_url or not review or not rating:
#         return jsonify({"error": "Missing required fields"}), 400

#     try:
#         # Step 2: Connect to MongoDB
#         if not client:
#             return jsonify({"error": "Failed to connect to MongoDB"}), 500

#         # Step 3: Prepare the document for insertion
#         review_document = {
#             "url": product_url,
#             "review": review,
#             "rating": rating,
#             "category": categorize_review(review, ["durability", "price", "accessibility", "versatility"])
#         }

#         # Step 4: Insert the review into MongoDB
#         db = client['review-db']
#         collection = db['reviews'] 
#         insert_result = collection.insert_one(review_document)
#         collection.find()
        
#         return jsonify({"message": "Review submitted"}), 201

#     except Exception as e:
#         print(f"Error submitting review: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/search_review', methods=['POST', 'OPTIONS'])
# def search_review():
#     if request.method == 'OPTIONS':
#         # Handle the preflight OPTIONS request
#          return '', 200  # Respond with 200 OK for the preflight request
#     """Receive URL, review, rating; generate review embedding, and insert into MongoDB."""
#     data = request.json
#     product_url = data.get('url')
#     question = data.get('text')
#     #user_selected_category = data.get('category')
#     user_selected_category = categorize_question(question, ["durability", "price", "accessibility", "versatility"])
#     all_intended_reviews = []
    
#     # Find the document
#     try:
#         # Connect to MongoDB
#         if not client:
#             return jsonify({"error": "Failed to connect to MongoDB"}), 500
        
#         db = client['review-db']
#         collection = db['reviews'] 
#         # collection.find({"field1": "value1", "field2": "value2"})
#         documents = collection.find({"category": user_selected_category, "url": product_url})
#         all_intended_reviews = []
#         for doc in documents:
#             review = doc.get('review', "")
#             all_intended_reviews.append(review)
#         return json.dumps(all_intended_reviews)
       
#     except Exception as e:
#         print(e)
#         return None
    

if __name__ == "__main__":
    app.run(port=5000, debug=True)