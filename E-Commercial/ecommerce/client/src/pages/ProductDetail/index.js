import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from "react-router-dom"
import { fetchProduct } from '../../api';
import { Box, Text, Button } from "@chakra-ui/react"
import moment from 'moment';
import ImageGallery from "react-image-gallery"
import { useBasket } from "../../contexts/BasketContext"
import "./styles.css"




function ProductDetail() {
    const { product_id } = useParams();
    const { addToBasket, items } = useBasket();


    const { isLoading, isError, data } = useQuery(['product', product_id], () =>
        fetchProduct(product_id)
    );

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error.</div>
    }

    const findBasketItem = items.find((item) => item._id === product_id);
    const images = data.photos.map((url) => ({ original: url }))

    return <div className="container">
    

        <Box className="content">
            <Box>
                <ImageGallery className="images" items={images} showThumbnails={false} />
            </Box>
            <Box className="right">
                <Text as="h2" fontSize="2xl">{data.title}</Text>
                <Text>{moment(data.createdAt).format("DD/MM/YYYY")}</Text>

                <p>{data.description}</p>
                <Button className="button" colorScheme={findBasketItem ? "pink" : "green"} onClick={() => addToBasket(data, findBasketItem)}>
            {findBasketItem ? "Remove from basket" : " Add to basket"}</Button>
            </Box>
        </Box>





    </div>
}

export default ProductDetail
