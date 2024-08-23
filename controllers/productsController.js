import pool from "../DB/db.js";

//End Point to retrieve all the products

// const getProducts = (req, res) => {
//     return res.status(200).send("List of products")
// }

const getProducts = async (req, res) => {
    try {
        //  console.log("Inside")
        const selectQuery = "select * from practice.products";

        const result = await pool.query(selectQuery);
        // console.log("Result" + JSON.stringify(result));

        // if (result != null && result.rowCount > 0) {
        //     return res.status(200).json(result.rows);
        // }

        if (res.statusCode === 200 && result.rowCount > 0) {
            return res.status(200).json(result.rows);

        }
        else {
            console.log("Couldn't retrieve data")
            return res.status(404).json({ error: 'No Data Found' })
        }

        // if (res.status === 200) {
        //     return res.status(200).json(result.rows)
        // }
        // else {
        //     console.log("Couldn't retrieve data")
        //     return res.status(404).json({ error: 'Data Not Found' })
        // }
    }
    catch (error) {
        console.log("Error Caught " + error?.message)
        return res.status(500).json({ error: 'Internal Error' })
    }
}

//Get Single product based on Product Id

const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const selectQuery = `select * from practice.products where product_id = ${id}`;
        const result = await pool.query(selectQuery);
        if (res.statusCode === 200) {
            if (result.rowCount === 1) {
                return res.status(200).json(result.rows)
            }
            else {
                return res.status(404).json({ error: 'Id Not Found' })
            }
        }
        else {
            return res.status(400).json({ error: 'Error Retrieving Data' })
        }
    }
    catch (error) {
        console.log("Error Caught " + error?.message)
        return res.status(500).json({ error: 'Internal Error' })
    }
}

//Retrieve a product by category
const getProductsByCategory = async (req, res) => {
    try {
        const category = req.query.category;
        // console.log("Category " + category);
        const selectQuery = `select * from practice.products where category = '${category}'`;
        const result = await pool.query(selectQuery);
        if (res.statusCode === 200) {
            if (result.rowCount >= 1) {
                return res.status(200).json(result.rows)
            }
            else {
                return res.status(404).json({ error: 'No Products found for the given category' })
            }
        }
        else {
            return res.status(400).json({ error: 'Error Retrieving Data' })
        }
    }
    catch (error) {
        console.log("Error Caught " + error?.message)
        return res.status(500).json({ error: 'Internal Error' })
    }
}

//Get Products with Given PriceRange between minPrice and maxPrice
const getProductsByPriceRange = async (req, res) => {
    try {
        const min = req.query.min;
        const max = req.query.max;
        const selectQuery = `select * from practice.products where price between ${min} and  ${max}`;

        const result = await pool.query(selectQuery);

        if (res.statusCode === 200) {
            if (result.rowCount >= 1) {
                return res.status(200).json(result.rows);
            } else {
                return res.status(404).json({ error: 'No Products found in the given price range' });
            }
        } else {
            return res.status(400).json({ error: 'Error Retrieving Data' });
        }
    } catch (error) {
        console.log("Error Caught " + error?.message);
        return res.status(500).json({ error: 'Internal Error' });
    }
}

//Create a new Product to be inserted in the database
// const createNewProduct = async (req, res) => {
//     try {
//         const newProduct = req.body;

//         const insertQuery = `INSERT into practice.products(product_name, price, category, star_rating, description, product_code, imageurl) values('${newProduct.product_name}', '${newProduct.price}', '${newProduct.category}',  '${newProduct.star_rating}', '${newProduct.description}', '${newProduct.product_code}', '${newProduct.imageurl}');`


//         // if (newProduct.product_name !== null && newProduct.price !== null && newProduct.category !== null && newProduct.star_rating !== null && newProduct.product_code !== null)

//         // Validate Input
//         if (!newProduct.product_name || !newProduct.price || !newProduct.category || !newProduct.star_rating || !newProduct.description || !newProduct.product_code || !newProduct.imageurl) {
//             return res.status(400).json({ error: 'All Fields are required' });
//         }
//         else {
//             const result = await pool.query(insertQuery);
//             return res.status(201).send({ message: 'Product Created Successfully' });
//         }
//     } catch (error) {
//         console.error("Error Caught: " + error.message);
//         return res.status(500).json({ error: `Internal Server Error ${error.message}` });
//     }
// };

const createNewProduct = async (req, res) => {
    try {
        const { productname, price, category, star_rating, description, productcode, imageurl } = req.body;

        const insertQuery = `INSERT into practice.products(productname, price, category, star_rating, description, productcode, imageurl) values($1, $2, $3, $4,  $5, $6, $7) RETURNING *;`
        const values = [productname, price, category, star_rating, description, productcode, imageurl]

        // Validate Input
        if (!productname || !price || !category || !star_rating || !description || !productcode || !imageurl) {
            return res.status(400).json({ error: 'All Fields are required' });
        }
        else {
            const result = await pool.query(insertQuery, values);
            return res.status(201).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Error Caught: " + error.message);
        return res.status(500).json({ error: `Internal Server Error ${error.message}` });
    }
};

//Update the product star_rating

const updateProductStarRating = async (req, res) => {
    try {
        const id = req.params.id;
        const { price, star_rating } = req.body;

        const updateQuery = `UPDATE practice.products SET price = $1, star_rating = $2 WHERE product_id = ${id} ;`
        const values = [price, star_rating];

        if (price !== null && star_rating !== null) {
            const result = await pool.query(updateQuery, values);

            // Validate Input
            if (result.statusCode === 400 || result.statusCode === 404) {
                return res.status(404).json({ error: 'Product not found' }); //Handle case where the product does not exist
            }
            else {
                return res.status(200).send("Product Updated with price and star_rating"); //Send the updated product as a JSON
            }
        }
        else {
            return res.status(400).json('Bad request : data not working for updating the product');

        }
    } catch (error) {
        console.error("Error Caught: " + error.message);
        return res.status(500).json({ error: `Internal Server Error ${error.message}` });
    }
}

const deleteProductsById = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate input (check if id exists)
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const deleteQuery = `DELETE FROM practice.products WHERE product_id = $1`;
        const values = [id];

        const result = await pool.query(deleteQuery, values);

        // Check if any rows were deleted
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).send("Product Deleted Successfully");
    } catch (error) {
        console.error("Error Caught: " + error.message);
        return res.status(500).json({ error: `Internal Server Error ${error.message}` });
    }
};


export { getProducts, getProductById, getProductsByCategory, getProductsByPriceRange, createNewProduct, updateProductStarRating, deleteProductsById };