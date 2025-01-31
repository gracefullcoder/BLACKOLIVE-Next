"use client";
import React from "react";
import ActiveMembership from "@/src/components/adminorders/manage/ActiveMembership";

export default function page() {
   return (<ActiveMembership onlyAssigned={false}/>)
}
