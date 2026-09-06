const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(
    __dirname,
    "..",
    "data"
);

if (!fs.existsSync(dataDirectory)) {

    fs.mkdirSync(
        dataDirectory,
        {
            recursive: true
        }
    );
}

function getFilePath(collection) {

    return path.join(
        dataDirectory,
        `${collection}.json`
    );
}

function readCollection(collection) {

    const filePath =
        getFilePath(collection);

    if (!fs.existsSync(filePath)) {

        fs.writeFileSync(
            filePath,
            "[]"
        );
    }

    try {

        const content =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        return content.trim()
            ? JSON.parse(content)
            : [];

    } catch (error) {

        console.error(
            `Failed reading ${collection}:`,
            error.message
        );

        return [];
    }
}

function writeCollection(
    collection,
    data
) {

    const filePath =
        getFilePath(collection);

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            data,
            null,
            2
        )
    );

    return data;
}

function addToCollection(
    collection,
    item
) {

    const data =
        readCollection(collection);

    data.push(item);

    writeCollection(
        collection,
        data
    );

    return item;
}

module.exports = {
    readCollection,
    writeCollection,
    addToCollection
};