from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from inference import (
    get_product_and_description_from_url,
    get_questions_for_product,
    categorize_review,
    categorize_question,
    summarize_all_reviews,
    extract_main_domain
)
from database_functions import (
    find_products_by_url,
    find_reviews_by_url,
    insert_into_review_table,
    select_table_contents,
    delete_review_by_id,
    edit_review_db,
    insert_into_product_table,
    REVIEW_TABLE
)

app = Flask(__name__)
app.secret_key = os.urandom(32)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_reviews_from_url', methods=['POST'])
def find_reviews_from_url():
    data = request.get_json()
    url = data.get('url')
    reviews = find_reviews_by_url(url)
    return jsonify(reviews), 200

@app.route('/get_product_questions', methods=['POST'])
def get_product_questions():
    data = request.get_json()
    url = data.get('url')

    product_info = find_products_by_url(url)
    if product_info:
        return jsonify(product_info[0]), 200

    #does not exist so insert into db
    product_and_questions = get_questions_for_product(get_product_and_description_from_url(url))
    print(product_and_questions)

    product_data = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "category": "shoes",
        "title": product_and_questions['title'],
        "description": product_and_questions['description'],
        "url": product_and_questions['url'],
        "questions": product_and_questions['questions']
    }

    insert_into_product_table(product_data)

    return jsonify(product_and_questions), 200

@app.route('/review_summary', methods=['POST'])
def review_summary():
    data = request.get_json()
    url = data.get('url')
    all_reviews = find_reviews_by_url(url)

    product_info = find_products_by_url(url)
    if product_info:
        product_info = product_info[0]
    else:
        product_info = get_product_and_description_from_url(url)

    product_info_str = product_info["title"] + " " + product_info["category"]
    summary = summarize_all_reviews(product_info_str, all_reviews)
    return jsonify(summary), 200

@app.route("/submit_review", methods=['POST'])
def submit_review():
    try:
        data = request.get_json()
        product_url = data.get('url')
        review = data.get('review')
        rating = data.get('rating')

        review_document = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "url": product_url,
            "review": review,
            "rating": rating,
            "category": categorize_review(review, ["durability", "price", "accessibility", "versatility"]),
            "hostSite": extract_main_domain(product_url)
        }

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
    return jsonify(res), 200

@app.route("/delete_review", methods=['POST'])
def delete_review():
    data = request.get_json()
    review_id = data.get("reviewId")
    if delete_review_by_id(review_id):
        return jsonify({"message": "Review deleted successfully"}), 200
    return jsonify({"message": "Error in deleting review"}), 500

@app.route('/edit_review', methods=['POST'])
def edit_review():
    try:
        data = request.get_json()
        review_id = data.get('reviewId')
        updated_review = data.get('newText')
        updated_rating = data.get('newRating')

        res = edit_review_db(review_id, updated_review, updated_rating)
        if res:
            return jsonify({"success": "true"}), 200
        else:
            return jsonify({"error": str(res)}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)