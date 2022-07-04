import axios from "../lib/axios";
import React from "react";

export default function Admin() {
    const postFixtureIds = async () => {
        const res = await axios.post('api/custom_fixture/post');
        console.log(res)
    }

    const postFixtureOdds = async () => {
        const res = await axios.post('api/custom_fixture/odds');
        console.log(res)
    }
    return (
        <>
            <h1>Admin</h1>
            <button className="btn btn-primary" onClick={postFixtureIds}>
                Post fixture Ids
            </button>
            <button className="btn btn-primary" onClick={postFixtureOdds}>
                Post Odds
            </button>
        </>
    )
}