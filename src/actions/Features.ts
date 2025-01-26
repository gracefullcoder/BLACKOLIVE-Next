"use server"

import connectToDatabase from "../lib/ConnectDb";
import Feature from "../models/feature"

export const createFeature = async (heroImage: string, fileId: string) => {
    await connectToDatabase()
    const feature = new Feature({ heroImage, fileId });
    await feature.save();
    return { success: true, message: "Feature Created Successfully" }
}

export const updateFeature = async (heroImage: string, fileId: string) => {
    try {
        const featureId = process.env.FEATURE_ID
        const feature = await Feature.findByIdAndUpdate(featureId, { heroImage, fileId });
        return { success: true, message: "Image updated Successfully" }
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "failed to update image" }
    }
}

export const featureDetails = async () => {
    const featureId = process.env.FEATURE_ID
    const feature = await Feature.findById(featureId);
    return JSON.parse(JSON.stringify(feature));
}

export async function addTiming(formData: FormData) {
    const newTime = {
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        deliveryTime: formData.get('deliveryTime'),
        display: formData.get('display')
    }
    console.log('Submitted time:', newTime);
    const featureId = process.env.FEATURE_ID

    await Feature.findByIdAndUpdate(featureId, {
        $push: { deliveryTimings: newTime },
    });

    return { success: true, message: 'Timing added successfully' };
}