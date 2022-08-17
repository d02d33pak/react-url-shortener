import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";

const App = () => {
    const [url, setUrl] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        console.log("ON LOAD...");
        updateUrls();
    }, []);

    const updateUrls = () => {
        const result = fetch("http://localhost:8000/");
        console.log("FETCHING...");
        result
            .then((response) => response.json())
            .then((response) => {
                console.log("FETCHED...");
                setResults(response);
            })
            .catch((error) => {
                console.log("ERROR FETCHING...");
                console.log(error);
            });
    };

    const handleSubmit = () => {
        console.log("ADDING...");
        if (validUrl(url)) {
            const result = fetch("http://localhost:8000/url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    originalUrl: url,
                    count: 0,
                }),
            });
            result
                .then((response) => response.json())
                .then((response) => {
                    console.log("ADDED...");
                    toast.success("URL added successfully");
                    setResults([...results, response]);
                    setUrl("");
                })
                .catch((error) => {
                    console.log("ERROR ADDING...");
                    toast.error("Error while adding URL");
                    console.log(error);
                });
        } else {
            console.log("INVALID URL...");
            toast.error("Invalid URL");
        }
    };

    const handleDelete = (id) => {
        console.log("DELETING...");
        const result = fetch(`http://localhost:8000/delete/${id}`, {
            method: "DELETE",
        });
        result
            .then((response) => response.json())
            .then((response) => {
                console.log("DELETED...");
                toast.success("URL deleted successfully");
                setResults(results.filter((url) => url._id !== id));
            })
            .catch((error) => {
                console.log("ERROR DELETING");
                toast.error("Error while deleting URL");
                console.log(error);
            });
    };

    const validUrl = (url) => {
        const regex =
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/gi;
        return regex.test(url);
    };

    return (
        <div className="container">
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                transition={Slide}
            />
            <section className="section">
                <p className="title">Url Shortener</p>
            </section>
            <section className="section">
                <div className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label className="label">Enter URL</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <p className="control is-expanded ">
                                <input
                                    className="input"
                                    type="text"
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                    }}
                                />
                            </p>
                        </div>
                        <div className="field">
                            <p className="control is-expanded ">
                                <button
                                    className="button is-primary"
                                    onClick={handleSubmit}
                                >
                                    Create Short URL
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="title">Generated Short Urls</div>
                <table className="table is-bordered is-striped is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Original Url</th>
                            <th>Short Url</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={result._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <a
                                        href={result.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {result.originalUrl}
                                    </a>
                                </td>
                                <td>
                                    <a
                                        href={`http://localhost:8000/${result.shortUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                            console.log(
                                                "INCREMENTING CLICKS..."
                                            );
                                            setTimeout(updateUrls(), 2000);
                                        }}
                                    >
                                        {result.shortUrl}
                                    </a>
                                </td>
                                <td>{result.count}</td>
                                <td>
                                    <span
                                        className="delete"
                                        onClick={() => {
                                            handleDelete(result._id);
                                        }}
                                    ></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default App;
