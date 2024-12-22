from flask import Flask, request, jsonify
from inference import get_product_and_description_from_url, get_questions_for_product  # Import your AI generation function
from product import insert_if_not_exists, find_by_url  # MongoDB functions
from inference import enhance_question
from vector_metrics import query_for_embedding
from inference import categorize_review
import time
import json


# def main():
    
#     # if client:
#     #     # Example product document
#     #     urls= [
#     #     "https://kith.com/collections/kith-footwear/products/x2j162xf85500",
#     #     "https://www.amazon.com/eos-Cashmere-Moisture-Lightweight-Non-Greasy/dp/B08KT2Z93D/?_encoding=UTF8&pd_rd_w=a3wu2&content-id=amzn1.sym.aeef70de-9e3e-4007-ae27-5dbb7b4a72f6&pf_rd_p=aeef70de-9e3e-4007-ae27-5dbb7b4a72f6&pf_rd_r=21NA7K6QEXX5X2F6N2KM&pd_rd_wg=l7cK3&pd_rd_r=903996a9-0eaa-4382-bfac-680c67cfe909&ref_=pd_hp_d_btf_crs_zg_bs_3760911",
#     #     #Captcha"https://www.walmart.com/ip/Austin-Peanut-Butter-on-Cheese-Sandwich-Crackers-Single-Serve-Snack-Crackers-20-Count/1837462801?classType=REGULAR&athbdg=L1600&adsRedirect=true",
#     #     #Timeout"https://www.meijer.com/shopping/product/sony-zx-series-stereo-headphones-black/2724286708.html",
#     #     "https://us.shein.com/SHEIN-EZwear-Women-s-Hooded-Sweatshirt-With-Slogan-Print-And-Kangaroo-Pocket-FAITH-OVER-FEAR-PSALM-563-p-29621449.html?src_identifier=uf=usbingsearch09_cheaptrendyclothes02_20220804&src_module=ads&mallCode=1&pageListType=4&imgRatio=3-4",
#     #     "https://www.gap.com/browse/product.do?pid=538469002&rrec=true&mlink=5001,1,home_gaphome2_rr_0&clink=1",
#     #     "https://www.target.com/p/marvel-youth-spider-man-halloween-costume/-/A-90605950?preselect=90599841#lnk=sametab",
#     #     "https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500"
#     #     ]
#     #     for url in urls:
#     #         prod_entry = get_product_and_description_from_url(url)
#     #         document = get_questions_for_product(prod_entry)
#     #         insert_if_not_exists(client, DB_NAME, COLLECTION_NAME, document)


# if __name__ == "__main__":
#     main()


def test_script():
    durability_reviews = [
    "I've been using these shoes for months, and they are still holding up great. The durability is impressive, even after constant use on the court.",
    "Not happy with how quickly these shoes wore out. After just a few games, the soles are already starting to come apart.",
    "I can’t believe how long these shoes have lasted! I’ve played in them every weekend, and they still feel as solid as the first day I wore them.",
    "The shoes were decent, but after about two months, they started to show signs of wear and tear. Definitely not as durable as I had hoped.",
    "These shoes are built like a tank! I've played on rough outdoor courts, and they've held up amazingly well."
]
    price_reviews = [
    "These shoes are way overpriced for what you get. The design is nice, but I don’t think they’re worth the money.",
    "I love the look and style of these shoes, but they definitely aren’t budget-friendly. You can find similar shoes for a lower price.",
    "While they perform well on the court, the price tag is just too high. I don’t think they offer good value for the cost.",
    "The fit is okay, but I expected more comfort given the price point. They’re not as cushioned as I hoped they would be.",
    "Honestly, I bought these just because they look cool. I don’t care much about the performance, but the aesthetic is top-notch."
]
    
    categories = ['price', 'durability', 'aesthetic']
    client = connect_to_mongo()
    if not client:
        return jsonify({"error": "Failed to connect to MongoDB"}), 500
    
    for review in durability_reviews:
        # Step 3: Prepare the document for insertion
        review_document = {
            "url": "xyz.com",
            "review": review,
            "rating": 5,
            "category": categorize_review(review, categories)
        }

        # Step 4: Insert the review into MongoDB
        db = client['review-db']
        collection = db['reviews'] 
        insert_result = collection.insert_one(review_document)
        
    
    for review in price_reviews:
        # Step 3: Prepare the document for insertion
        review_document = {
            "url": "xyz.com",
            "review": review,
            "rating": 5,
            "category": categorize_review(review, categories)
        }

        # Step 4: Insert the review into MongoDB
        db = client['review-db']
        collection = db['reviews'] 
        insert_result = collection.insert_one(review_document)
    

    

    # question = "How long do these shoes last?"
    # user_selected_category = "durability"
    # query = {"url": 'xyz.com'}

    # db = client['review-db']
    # collection = db['reviews'] 
    # # collection.find({"field1": "value1", "field2": "value2"})
    # documents = collection.find({"category": user_selected_category, "url": "xyz.com"})
    # all_intended_reviews = []
    # for doc in documents:
    #     review = doc.get('review', "")
    #     all_intended_reviews.append(review)
    # print(all_intended_reviews)
    #return json.dumps(all_intended_reviews)
    return None

def insert_xyz():
    client = connect_to_mongo()
    url="https://kith.com/collections/kith-footwear/products/x2j162xf85500"
    prod_entry = get_product_and_description_from_url(url)
    final_entry = get_questions_for_product(prod_entry)
    final_entry['url'] = 'xyz.com'
    insert_if_not_exists(client, 'review-db', 'products', final_entry)

if __name__ == "__main__":
    #test_script()
    insert_xyz()