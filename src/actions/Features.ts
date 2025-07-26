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
    try {
        const feature = await Feature.findOne();
        return JSON.parse(JSON.stringify(feature));
    } catch (error) {
        return { success: false, message: "Unable to Fetch Pincodes" }
    }
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
    try {
        await connectToDatabase()
        const feature: any = await Feature.findOne().select("deliveryTimings");
        console.log("apple", feature.deliveryTimings)
        return { success: true, message: 'Timing added successfully', data: JSON.parse(JSON.stringify(feature?.deliveryTimings)) };
    } catch (error) {
        console.log(error)
        return { success: false, message: 'Timing added successfully' };

    }
}


export async function deleteTimingServer(timingId: any) {

    try {
        await Feature.findOneAndUpdate({
            $pull: { deliveryTimings: { _id: timingId } },
        });
        return { success: true, message: "Timing deleted successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}


export async function updateTimingServer(timingDetails: any) {
    try {
        const result = await Feature.findOneAndUpdate(
            { "deliveryTimings._id": timingDetails._id },
            { $set: { "deliveryTimings.$": timingDetails } },
            { new: true }
        );

        if (!result) {
            return { success: false, message: "Timing not found" };
        }

        return { success: true, message: "Timing updated successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const getPincodeDetails = async (pincode: number) => {
    const feature = await Feature.findOne({ "pincodes.pincode": pincode }, { pincodes: 1 });

    if (!feature) return null;

    const matchedPincode = feature.pincodes.find((pin: any) => pin.pincode === pincode);
    return matchedPincode || null;
};

