import os
from inference import get_product_and_description_from_url, get_questions_for_product
from database_functions import *
import uuid
from datetime import datetime

# userInfo: user_id, created_at, name, email (passwords are through external auth for user id)
# productInfo: id, created_at, category, title, description, url, questions
# reviews: id, created_at, url, review, rating, category, hostSite


# add_entry(USERS_TABLE, {"user_id": str(uuid.uuid4()), "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 
# "name": "John Doe", "email": "johndoe123@gmail.com"})
# add_entry(PRODUCT_TABLE, {"id": str(uuid.uuid4()), 
# "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 
# "category": "shoes", "title": "Nike Air Max", 
# "description": "The best shoes ever", 
# "url": "https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500", 
# "questions": {"q1": "How comfortable are these shoes?", "q2": "How long do these shoes last?"}})
# add_entry(REVIEW_TABLE, {"id": str(uuid.uuid4()), "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "url": "https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500", 
# "review": "These shoes are amazing", "rating": 5, "category": "comfort", "hostSite": "Nike"})

# delete_entry(USERS_TABLE, "name", "Daniel")
# update_entry(USERS_TABLE, {"name": "Jane Doe"}, "name", "John Doe")
# print(select_table_contents(USERS_TABLE, "name", "name", "Jane Doe"))


import uuid
from datetime import datetime

# Test the connect_to_supabase function
def test_connect_to_supabase():
    supabase = connect_to_supabase()
    if supabase:
        print("Connection to Supabase successful.")
    else:
        print("Connection to Supabase failed.")

# Test the select_table_contents function
def test_select_table_contents():
    result = select_table_contents(USERS_TABLE, "name", "name", "John Doe")
    print(result)
    if result != []:
        print(f"Found user: {result}")
    else:
        print("No user found.")

# Test the add_entry function
def test_add_entry_user():
    user_data = {
        "user_id": str(uuid.uuid4()), 
        "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "name": "John Doe", 
        "email": "johndoe123@gmail.com"
    }
    result = add_entry(USERS_TABLE, user_data)
    if result:
        print(f"User added: {result}")
    else:
        print("Failed to add user.")

# Test the insert_into_product_table function
def test_insert_into_product_table():
    product_data = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "category": "shoes",
        "title": "Nike Air Max",
        "description": "The best shoes ever",
        "url": "https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500",
        "questions": {"q1": "How comfortable are these shoes?", "q2": "How long do these shoes last?"}
    }
    insert_into_product_table(product_data)

# Test the insert_into_review_table function
def test_insert_into_review_table():
    review_data = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "url": "https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500",
        "review": "These shoes are amazing",
        "rating": 5,
        "category": "comfort",
        "hostSite": "Nike"
    }
    insert_into_review_table(review_data)

# Test the update_entry function
def test_update_entry_user():
    updated_user_data = {"name": "Jane Doe"}
    result = update_entry(USERS_TABLE, updated_user_data, "name", "John Doe")
    if result:
        print(f"Updated user: {result}")
    else:
        print("Failed to update user.")

def test_edit_review():
    result = edit_review("8fcec447-67ff-4361-ae87-301609011dc0", "These shoes are not as good as I thought.", 3)
    if result:
        print(f"Updated review: {result}")
    else:
        print("Failed to update review.")

# Test the delete_entry function
def test_delete_entry():
    result = delete_entry(USERS_TABLE, "name", "Jane Doe")
    if result:
        print(f"Deleted user: {result}")
    else:
        print("Failed to delete user.")

# Test the delete_review_by_id function
def test_delete_review_by_id():
    result = delete_review_by_id("12d677c4-e589-4e65-8d86-0f652e87d8a5")  # Replace with an actual review ID if needed
    if result:
        print(f"Deleted review: {result}")
    else:
        print("No review found to delete.")

# Test the find_review_by_url function
def test_find_review_by_url():
    #result = find_reviews_by_url("https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500")
    result = find_reviews_by_url("https://us.burberry.com/skinny-check-silk-scarf-p80947011")
    if result:
        print(f"Found review: {result}")
    else:
        print("Review not found.")

# Test the find_product_by_url function
def test_find_product_by_url():
    result = find_products_by_url("https://www.nike.com/t/ja-2-basketball-shoes-zNhj0Q/FD7328-500")
    if result:
        print(f"Found product: {result}")
    else:
        print("Product not found.")

# Run all tests
def run_tests():
    # print("\nTesting connection to Supabase:")
    # test_connect_to_supabase()
    
    # print("\nTesting select_table_contents:")
    # test_select_table_contents()
    
    # print("\nTesting add_entry:")
    # test_add_entry_user()
    
    # print("\nTesting insert_into_product_table:")
    # test_insert_into_product_table()
    
    # print("\nTesting insert_into_review_table:")
    # test_insert_into_review_table()
    
    # print("\nTesting update_entry:")
    # test_update_entry_user()

    # print("\nTesting edit_review:")
    # test_edit_review()
    
    # print("\nTesting delete_entry:")
    # test_delete_entry()
    
    # print("\nTesting delete_review_by_id:")
    # test_delete_review_by_id()
    
    print("\nTesting find_review_by_url:")
    test_find_review_by_url()
    
    # print("\nTesting find_product_by_url:")
    # test_find_product_by_url()

if __name__ == "__main__":
    run_tests()