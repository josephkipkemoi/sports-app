import React from "react";

export default function generateBase64Encoding(short_code, passkey, timestamp) {
    const decodedStringBtoA = short_code + passkey + timestamp

    const encodedStringBtoA = btoa(decodedStringBtoA)
    
    return encodedStringBtoA
}