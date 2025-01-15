"use server"

import connectToDatabase from "../lib/ConnectDb";
import Feature from "../models/Feature"

export const createFeature = async (heroImage: string, fileId: string) => {
    await connectToDatabase()
    const feature = new Feature({ heroImage, fileId });
    await feature.save();
    return { success: true, message: "Feature Created Successfully" }
}

export const updateFeature = async (heroImage: string, fileId: string) => {
    await connectToDatabase()

    const feature = await Feature.findByIdAndUpdate('678807838d40059864348c1d', { heroImage, fileId });
    return { success: true, message: "Image updated Successfully" }
}

export const featureDetails = async () => {
    await connectToDatabase()
    const feature = await Feature.findById('678807838d40059864348c1d');
    return JSON.parse(JSON.stringify(feature));
}
