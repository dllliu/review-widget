import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase credentials are not set in environment variables.');
}

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Constants for table names
// const USERS_TABLE = "userInfo";
const PRODUCT_TABLE = "productInfo";
const REVIEW_TABLE = "reviews";

// Generic helper function to select data from a table
async function selectTableContents(
    tableName: string,
    columnName?: string,
    conditionName?: string,
    conditionValue?: string | number | null
): Promise<Record<string, any>[] | null> {
    try {
        let query = supabase.from(tableName).select(columnName || "*");

        if (conditionName && conditionValue) {
            query = query.eq(conditionName, conditionValue);
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Error selecting from table ${tableName}:`, error);
            return null;
        }
        return data;
    } catch (e) {
        console.error(`Error selecting from table ${tableName}:`, e);
        return null;
    }
}

// Helper function to insert data into a table
async function addEntry(
    tableName: string,
    values: Record<string, any>
): Promise<Record<string, any>[] | null> {
    try {
        const { data, error } = await supabase.from(tableName).insert(values);

        if (error) {
            console.error(`Error adding entry to table ${tableName}:`, error);
            return null;
        }
        return data;
    } catch (e) {
        console.error(`Error adding entry to table ${tableName}:`, e);
        return null;
    }
}

// Helper function to delete data from a table
async function deleteEntry(
    tableName: string,
    conditionName: string,
    conditionValue: string | number
): Promise<Record<string, any>[] | null> {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .delete()
            .eq(conditionName, conditionValue);

        if (error) {
            console.error(`Error deleting entry from table ${tableName}:`, error);
            return null;
        }
        return data;
    } catch (e) {
        console.error(`Error deleting entry from table ${tableName}:`, e);
        return null;
    }
}

// Helper function to update data in a table
async function updateEntry(
    tableName: string,
    desiredJson: Record<string, any>,
    conditionName: string,
    conditionValue: string | number
): Promise<Record<string, any>[] | null> {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .update(desiredJson)
            .eq(conditionName, conditionValue);

        if (error) {
            console.error(`Error updating entry in table ${tableName}:`, error);
            return null;
        }
        return data;
    } catch (e) {
        console.error(`Error updating entry in table ${tableName}:`, e);
        return null;
    }
}

// Insert a new product into the product table if it doesn't exist
async function insertIntoProductTable(query: Record<string, any>): Promise<void> {
    const productExists = await selectTableContents(PRODUCT_TABLE, "id", "id", query.id);
    if (productExists && productExists.length === 0) {
        await addEntry(PRODUCT_TABLE, query);
    } else {
        console.log(`Product ${query.id} already exists`);
    }
}

// Insert a new review into the review table if it doesn't exist
async function insertIntoReviewTable(query: Record<string, any>): Promise<void> {
    const reviewExists = await selectTableContents(REVIEW_TABLE, "id", "id", query.id);
    if (reviewExists && reviewExists.length === 0) {
        await addEntry(REVIEW_TABLE, query);
    } else {
        console.log(`Review ${query.id} already exists`);
    }
}

// Edit an existing review
async function editReview(
    id: string | number,
    newReview: string,
    newRating: number
): Promise<void> {
    const reviewExists = await selectTableContents(REVIEW_TABLE, "id", "id", id);
    if (reviewExists && reviewExists.length > 0) {
        await updateEntry(REVIEW_TABLE, { review: newReview, rating: newRating }, "id", id);
    } else {
        console.log(`No existing reviews found for ${id}`);
    }
}

// Delete a review by ID
async function deleteReviewById(id: string | number): Promise<void> {
    const review = await selectTableContents(REVIEW_TABLE, "id", "id", id);
    if (review && review.length > 0) {
        await deleteEntry(REVIEW_TABLE, "id", id);
    } else {
        console.log(`No existing reviews found for ${id}`);
    }
}

// Find reviews by URL
async function findReviewsByUrl(url: string): Promise<Record<string, any>[] | null> {
    const review = await selectTableContents(REVIEW_TABLE, "*", "url", url);
    if (review && review.length > 0) {
        return review;
    } else {
        console.log(`No existing reviews found for ${url}`);
        return null;
    }
}

// Find products by URL
async function findProductByUrl(url: string): Promise<Record<string, any>[] | null> {
    const product = await selectTableContents(PRODUCT_TABLE, "*", "url", url);
    if (product && product.length > 0) {
        return product;
    } else {
        console.log(`No existing products found for ${url}`);
        return null;
    }
}

// Fetch data from Supabase
async function fetchDataFromSupabase(): Promise<Record<string, any>[] | null> {
    try {
        const { data, error } = await supabase
            .from("your_table_name") // Replace with your Supabase table name
            .select("*"); // Adjust the query as needed

        if (error) throw new Error(error.message);

        return data;
    } catch (error) {
        console.error("Error fetching data from Supabase:", (error as Error).message);
        return null;
    }
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === "fetchData") {
        fetchDataFromSupabase()
            .then((data) => {
                sendResponse(data);
            })
            .catch((error) => {
                console.error("Error handling fetchData message:", error);
                sendResponse(null);
            });

        return true; // Keep the message channel open for async response
    }
});

// Export all functions for use in other parts of the application
export {
    selectTableContents,
    addEntry,
    deleteEntry,
    updateEntry,
    insertIntoProductTable,
    insertIntoReviewTable,
    editReview,
    deleteReviewById,
    findReviewsByUrl,
    findProductByUrl,
    fetchDataFromSupabase,
};