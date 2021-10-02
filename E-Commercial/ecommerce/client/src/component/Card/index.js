import React from 'react'
import moment from "moment";
import { Box, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import {useBasket} from "../../contexts/BasketContext"

function Card(data) {
    const {addToBasket , items} =useBasket();
    const findBasketItem = items.find((basket_item) => basket_item._id === data.item._id);

    
    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="3">
            <Link to={`/product/${data.item._id}`}>
                <Image src={data.item.photos[0]} alt="product" loading="lazy"/>
                <Box p="6">
                    <Box d="plex" alignItems="baseline">
                        {moment(data.item.createAt).format("DD/MM/YYYY")}
                    </Box>
                    <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                        {data.item.title}
                    </Box>
                    <Box>{data.item.price}TL</Box>

                </Box>
            </Link>
            <Button colorScheme={findBasketItem ? "pink" : "green"} variant="solid" onClick={() => addToBasket(data.item, findBasketItem)}>
                {findBasketItem ? "Remove from basket" :" Add to basket"}</Button>
        </Box>

    )
}

export default Card
