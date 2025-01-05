import ImageKit from "imagekit";

const config = {
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLICKEY || "",
    privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATEKEY || "",
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
}


const imagekit = new ImageKit(config);

export const uploadFile = async (file: any) => {

    try {
        const fileName = `product-${file.name}-${Date.now()}`;
        const result: any = await new Promise((resolve, reject) => {
            console.log("in");

            imagekit.upload({
                file: file,
                fileName: fileName,
                folder: `/BLACKOLIVE`
            }, (error, result) => {
                if (error) {
                    console.log("in imagekit error");

                    console.log(error);
                    reject(new Error("Error in Uploading Image!"));
                }
                else resolve(result);
            });
        });

        console.log(result)

        return result;

    } catch (error) {
        console.log(error);
        throw new Error("Please Enter Valid file image is required!");
    }
}


// const deleteFile = async (fileId) => {
//     let result = false;
//     await imagekit.deleteFile(fileId)
//         .then(response => {
//             console.log(response);
//             result = true;
//         })
//         .catch(error => {
//             console.log(error);
//             throw error;
//         });
//     return result;
// }