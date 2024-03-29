import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState } from "react";

function Dashboard_Filter({
    filterOptions = {
        keyword: "",
        price: [10, 5000000],
    },
    setFilterOptions,
    handleFilterClear,
}) {
    // function to handle filter values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "keyword":
                setFilterOptions({ ...filterOptions, keyword: value });
                break;
            case "category":
                setFilterOptions({ ...filterOptions, category: value });
                break;
            case "dateRange":
                setFilterOptions({ ...filterOptions, dateRange: value });
                break;
            default:
                break;
        }
    };

    // function to handle price change in filters
    const handlePriceChange = (value) => {
        setFilterOptions({ ...filterOptions, price: [...value] });
    };

    return (
        // Add filter options to the DOM element
        <div>
            <h2 className="text-lg font-medium mb-2">Filter Options</h2>
            <form className="flex flex-col gap-y-3">
                {/* Input to search through keyword */}
                <div className="mb-2">
                    <label htmlFor="keyword" className="font-medium block mb-1">
                        Keyword
                    </label>
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        value={filterOptions.keyword}
                        onChange={handleInputChange}
                        className="filterInput filterInput w-full border border-gray-300 px-3 py-2 rounded-md"
                        placeholder="Search by keyword..."
                    />
                </div>
                <div>
                    <h3>Price</h3>
                    <Slider
                        range
                        min={0}
                        max={5000000}
                        step={10000}
                        defaultValue={[10, 5000000]}
                        value={filterOptions.price}
                        onChange={handlePriceChange}
                    />
                    <p>
                        ₹{filterOptions.price[0]} - ₹{filterOptions.price[1]}
                    </p>
                </div>
            </form>
            <button
                onClick={handleFilterClear}
                className="w-full mt-2 text-white py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-800"
            >
                Clear Filters
            </button>
        </div>
    );
}

export default Dashboard_Filter;
