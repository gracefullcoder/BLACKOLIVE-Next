"use server"

import connectToDatabase from "../lib/ConnectDb";
import Feature from "../models/extraFeatures"

export const createFeature = async (heroImage: string, fileId: string) => {
    await connectToDatabase()
    const feature = new Feature({ heroImage, fileId });
    await feature.save();
    return { success: true, message: "Feature Created Successfully" }
}

export const updateFeature = async (heroImage: string, fileId: string) => {
    try {
        const feature = await Feature.findOneAndUpdate({ heroImage, fileId });
        return { success: true, message: "Image updated Successfully" }
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "failed to update image" }
    }
}

export const featureDetails = async () => {
    const feature = await Feature.findOne();
    return JSON.parse(JSON.stringify(feature));
}

export async function addTimingServer(formData: FormData) {
    const newTime = {
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        deliveryTime: formData.get('deliveryTime'),
        display: formData.get('display')
    }
    console.log('Submitted time:', newTime);

    await Feature.findOneAndUpdate({
        $push: { deliveryTimings: newTime },
    });

    return { success: true, message: 'Timing added successfully' };
}

export async function fetchTimingsServer() {
    const feature = await Feature.find({}).select("deliveryTimings");
    console.log("apple" ,feature)
    // return feature?.deliveryTimings || [];
    return []
}


export async function deleteTimingServer(timingId: any) {

    try {
        await Feature.findOneAndUpdate({
            $pull: { deliveryTimings: { _id: timingId } },
        });
        return { success: true, message: "Timing deleted successfully" };
    } catch (error:any) {
        return { success: false, message: error.message };
    }
}
