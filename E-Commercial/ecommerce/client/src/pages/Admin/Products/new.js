import React from 'react'
import { postProduct, updateProduct } from "../../../api"
import { useMutation, useQueryClient } from "react-query"
import { FieldArray, Formik } from "formik"
import { Box, Button, Textarea } from '@chakra-ui/react'
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import validationSchema from './validations'
import { message } from "antd"

function NewProduct() {
    const queryClient = useQueryClient();
    const newProductMutation = useMutation(postProduct, {
        onSuccess: () => queryClient.invlidateQuaries("admin:products"),
    });

    const handleSubmit = async (values, bag) => {
        message.loading({ content: "loading...", key: "product_update" })

        //values.photos = JSON.stringify(values.photos);

        const newValues = {
            ...values,
            photos: JSON.stringify(values.photos),
        };

        newProductMutation.mutate(newValues, {
            onSuccess: () => {
                console.log("success");
            }
        })


    }

    return (

        <div>
            <Text fontSize="2xl">New Product</Text>
            <Formik initialValues={{
                title: "",
                description: "",
                price: "",
                photos: [],
            }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {
                    ({
                        handleSubmit,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        values,
                        isSubmitting
                    }) => <>
                            <Box>
                                <Box my="5" textAlign="left">
                                    <form onSubmit={handleSubmit}>
                                        <FormControl>
                                            <FormLabel>Title</FormLabel>
                                            <Input
                                                name="title"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.title}
                                                disabled={isSubmitting}
                                                isInvalid={touched.title && errors.title} />
                                        </FormControl>
                                        <FormControl mt="4">
                                            <FormLabel>Description</FormLabel>
                                            <Textarea
                                                name="description"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.description}
                                                disabled={isSubmitting}
                                                isInvalid={touched.description && errors.description} />


                                        </FormControl>
                                        <FormControl mt="4">
                                            <FormLabel>Price</FormLabel>
                                            <Input
                                                name="price"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.price}
                                                disabled={isSubmitting}
                                                isInvalid={touched.price && errors.price} />

                                        </FormControl>
                                        <FormControl mt="4">
                                            <FormLabel>Photos</FormLabel>
                                            <FieldArray name="photos"
                                                render={(arrayHelpers) => (
                                                    <div>
                                                        {
                                                            values.photos && values.photos.map((photo, index) => (
                                                                <div key={index}>
                                                                    <Input
                                                                        name={`photos.${index}`}
                                                                        value={photo}
                                                                        disabled={isSubmitting}
                                                                        onChange={handleChange}
                                                                        width="3xl"
                                                                    />
                                                                    <Button type="button" ml="4" colorScheme="red" onClick={() => arrayHelpers.remove(index)}>
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            ))
                                                        }
                                                        <Button mt="5" onClick={() => arrayHelpers.push("")}>
                                                            Add a photo
                                                        </Button>


                                                    </div>
                                                )}

                                            />
                                        </FormControl>
                                        <Button mt={4} width="full" type="submit" isLoading={isSubmitting}>
                                            Save
                                        </Button>


                                    </form>
                                </Box>
                            </Box>
                        </>
                }
            </Formik>
        </div>
    )
}

export default NewProduct
