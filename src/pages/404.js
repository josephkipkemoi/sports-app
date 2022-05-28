import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan }  from "@fortawesome/free-solid-svg-icons/faBan";
import Link from "next/link";
export default function NotFoundPage() {
    return (
    <div className="text-center mt-5 pt-5 " style={{ color: "#fff", minHeight: '90vh' }}>
        <h1 className="p-5 fw-bold" style={{ fontSize: '42px' }}>404</h1>
        <svg style={{ height: '200px' }} className="text-light bg-warning rounded-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"/></svg>
        <h1 className="p-5 fw-bold" style={{ fontSize: '42px' }}>Not Found</h1>
        <h2 className="p-3">
            Back to 
            <Link href="/">
                <a
                    itemProp="url"
                    className="text-decoration-none text-warning fw-bold"
                    style={{ marginLeft: '10px' }}
                >
                    Home Page
                </a>               
            </Link>
        </h2>
    </div>
    )
}