"use client";
import React from "react";
import MemebershipDashBoard from "@/src/components/adminorders/manage/MembershipDashBoard";

export default function page() {
   return (<MemebershipDashBoard onlyAssigned={false} onlyActive={false}/>)
}
