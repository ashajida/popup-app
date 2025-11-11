import { Card, Select } from '@shopify/polaris';
import React from 'react'


export type Status = "draft" | "active";

export type StatusProps = {
    setStatus: (value: "draft" | "active") => void;
    status: "draft" | "active";
}

const Status = ({setStatus, status}: StatusProps) => {
    console.log("Status component rendered with status:", status);
  return (
    <Card>
        <Select
        label="Status"
        options={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
        ]}
        onChange={setStatus}
        value={status}
        />
    </Card>
  )
}

export default Status