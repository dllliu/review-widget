import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def connect_to_supabase():
    try:
        url: str = os.getenv("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        supabase: Client = create_client(url, key)
        return supabase
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return None

supabase = connect_to_supabase()
if not supabase:
    print("Error connecting to Supabase")
    exit()

USERS_TABLE = "userInfo"
PRODUCT_TABLE = "productInfo"
REVIEW_TABLE= "reviews"

#schema of each table
# userInfo: user_id, created_at, name, email (passwords are through external auth for user id)
# productInfo: id, created_at, category, title, description, url, questions
# reviews: id, created_at, url, review, rating, category, hostSite

def select_table_contents(table_name, column_name, condition_name, condition_value=None):
    """
    Retrieve rows from the specified table that meet the given condition, or all rows if no condition is specified.

    Args:
        table_name (str): The name of the table to query.
        column_name (str, optional): The specific column to select. If `None`, selects all columns.
        condition_name (str): The column to apply the condition on.
        condition_value (str, int, float, etc.): The value to match against the condition column.

    Returns:
        list or None: A list of rows from the table (as dictionaries). Returns `None` in case of an error.

    Raises:
        Exception: If there is an error while querying the table, an exception is printed, and `None` is returned.
    """
    try:    
        if column_name:
            res = supabase.table(table_name).select(column_name).eq(condition_name, condition_value).execute() 
        else:
            res = supabase.table(table_name).select("*").execute()
    except Exception as e:
        print(f"Error selecting from table {table_name}: {e}")
        return None
    return res.data

def add_entry(table_name, values):
    """
    Insert a new entry into the specified table.

    Args:
        table_name (str): The name of the table to insert the entry into.
        values (dict): A dictionary containing the column names and corresponding values to insert.

    Returns:
        dict or None: The newly added entry as a dictionary, or `None` if an error occurs.

    Raises:
        Exception: If there is an error during the insert operation, an exception is printed, and `None` is returned.
    """
    try:
        res = supabase.table(table_name).insert(values).execute()
        return res.data
    except Exception as e:
        print(f"Error adding entry to table {table_name}: {e}")
        return None

def delete_entry(table_name, condition_name, condition_value):
    """
    Delete an entry from the specified table based on the given condition.

    Args:
        table_name (str): The name of the table to delete the entry from.
        condition_name (str): The column name to apply the condition on.
        condition_value (str, int, float, etc.): The value to match against the condition column.

    Returns:
        dict or None: The deleted entry as a dictionary, or `None` if an error occurs.

    Raises:
        Exception: If there is an error during the delete operation, an exception is printed, and `None` is returned.
    """
    try:
        res = supabase.table(table_name).delete().eq(condition_name, condition_value).execute()
        return res.data
    except Exception as e:
        print(f"Error deleting entry from table {table_name}: {e}")
        return None 

def update_entry(table_name, desired_json, condition_name, condition_value):
    """
    Update an existing entry in the specified table based on a condition.

    Args:
        table_name (str): The name of the table to update.
        desired_json (dict): A dictionary of column names and values to update.
        condition_name (str): The column name to apply the condition on.
        condition_value (str, int, float, etc.): The value to match against the condition column.

    Returns:
        dict or None: The updated entry as a dictionary, or `None` if an error occurs.

    Raises:
        Exception: If there is an error during the update operation, an exception is printed, and `None` is returned.
    """
    try:
        res = (supabase.table(table_name).update(desired_json).eq(condition_name, condition_value).execute())
        return res.data
    except Exception as e:
        print(f"Error updating entry in table {table_name}: {e}")
        return None

def insert_into_product_table(query):
    """
    Insert a new product into the product table if it doesn't already exist.

    Args:
        query (dict): A dictionary containing product details, including the product's `id`.

    Returns:
        None: This function does not return a value but will print a message if the product already exists.

    Raises:
        Exception: If there is an error during insertion, an exception is printed.
    """
    product_exists = select_table_contents(PRODUCT_TABLE, "id", "id", query["id"])
    if product_exists == []:
        add_entry(PRODUCT_TABLE, query)
    else:
        print(f"Product {query["id"]} already exists")

def insert_into_review_table(query):
    """
    Insert a new review into the review table if it doesn't already exist.

    Args:
        query (dict): A dictionary containing review details, including the review's `id`.

    Returns:
        None: This function does not return a value but will print a message if the review already exists.

    Raises:
        Exception: If there is an error during insertion, an exception is printed.
    """
    review_exists = select_table_contents(REVIEW_TABLE, "id", "id", query["id"])
    if review_exists == []:
        add_entry(REVIEW_TABLE, query)
    else:
        print(f"Review {query["id"]} already exists")
        return None

def edit_review(id, new_review, new_rating):
    """
    Edit an existing review by updating the review content and rating based on the review ID.

    Args:
        id (str, int): The unique identifier of the review to update.
        new_review (str): The new review content.
        new_rating (int): The new rating for the review.

    Returns:
        None: This function does not return a value but prints a message if no existing review is found.

    Raises:
        Exception: If there is an error during the update, an exception is printed.
    """
    review_exists = select_table_contents(REVIEW_TABLE, "id", "id", id)
    if review_exists != []:
        res_data = update_entry(REVIEW_TABLE, {"review": new_review, "rating": new_rating}, "id", id)
        return res_data
    else:
        print(f"No existing reviews found for {id}")
        
def delete_review_by_id(id):
    """
    Delete a review from the review table by review ID.

    Args:
        id (int): The unique identifier of the review to delete.

    Returns:
        None: This function does not return a value but prints a message if no review is found.

    Raises:
        Exception: If there is an error during deletion, an exception is printed.
    """
    review = select_table_contents(REVIEW_TABLE, "id", "id", id)
    if review != []:
        delete_entry(REVIEW_TABLE, "id", id)
    else:
        print(f"No existing reviews found for {id}")

def find_reviews_by_url(url):
    """
    Retrieve a review from the review table based on the products's URL.

    Args:
        url (str): The URL associated with the review.

    Returns:
        list or None: A list of matching reviews, or `None` if no review is found.

    Raises:
        Exception: If there is an error during the search, an exception is printed.
    """
    review = select_table_contents(REVIEW_TABLE, "*", "url", url)
    if review != []:
        return review
    else:
        print(f"No existing reviews found for {url}")

def find_products_by_url(url):
    """
    Retrieve a product from the product table based on the product's URL.

    Args:
        url (str): The URL associated with the product.

    Returns:
        list or None: A list of matching products, or `None` if no product is found.

    Raises:
        Exception: If there is an error during the search, an exception is printed.
    """
    product = select_table_contents(PRODUCT_TABLE, "*", "url", url)
    if product != []:
        return product
    else:
        print(f"No existing products found for {url}")
        return None