import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { postOrder } from "../../api";
import "./styles.css"

import {
    Alert, Button, Image, Box, Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Textarea

} from "@chakra-ui/react"
import { useBasket } from "../../contexts/BasketContext"
import { useState } from 'react'

function Basket() {
    const [address, setAddress] = useState("");
    const { items, removeFromBasket, emptyBasket } = useBasket();
    const initialRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const total = items.reduce((acc, obj) => acc + obj.price, 0);

    const handleSubmitForm = async () => {
        const itemIds = items.map((item) => item._id);
        const input = {
            address,
            items: JSON.stringify(itemIds),
        };
        const response = await postOrder(input);

        emptyBasket();
        onClose();
        console.log(response)


    }

    return (
        <Box p="5">
            {items.length < 1 && (<Alert status="warning">You have not any items in your basket</Alert>)}
            {items.length > 0 && <>
                <ul style={{ listStyleType: "decimal" }}>
                    {
                        items.map((item) => (
                            <li className="li" key={item._id} style={{ marginBottom: 15 }}>
                                <div>
                                    <Link className="link" to={`/product/${item._id}`}>
                                        <div>
                                            <Image
                                                htmlWidth={200}
                                                loading="lazy"
                                                src={item.photos[0]}
                                                alt="baskete item"
                                            />
                                        </div>
                                        <div className="title">
                                            <Text fontSize="18">
                                                {item.title}
                                            </Text>
                                        </div>

                                    </Link>
                                </div>
                                <div className="price">
                                    <div>
                                        <Button mt="2" size="sm" colorScheme="pink" onClick={() => removeFromBasket(item._id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </div>
                                    <div>
                                        <Text fontSize="18">
                                            {item.price} TL
                                        </Text>
                                    </div>

                                </div>
                            </li>


                        ))
                    }
                </ul>
                <Box className="box" mt="10">
                <Text fontSize="22">Total: </Text>
                    <Text fontSize="22">{total} TL</Text>

                </Box>
                <Button h="10" mt="2" w="60%" ml="375" size="sm" colorScheme="green" onClick={onOpen}>Order</Button>

                <Modal
                    initialFocusRef={initialRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Order</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel>Adress</FormLabel>
                                <Textarea ref={initialRef} placeholder="Adress" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleSubmitForm}>
                                Save
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>}

        </Box>
    )
}

export default Basket
