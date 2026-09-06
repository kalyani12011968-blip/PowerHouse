const {
    spawn
} = require("child_process");

const path = require("path");

async function predict(data) {

    return new Promise((resolve) => {

        const python =
            process.env.PYTHON_COMMAND ||
            "python";

        const script =
            path.join(
                __dirname,
                "..",
                "..",
                "ai-ml",
                "src",
                "predict_service.py"
            );

        const processPython =
            spawn(python, [
                script,
                JSON.stringify(data)
            ]);

        let output = "";

        processPython.stdout.on(
            "data",
            chunk => {
                output += chunk.toString();
            }
        );

        processPython.on(
            "close",
            () => {

                try {

                    resolve(
                        JSON.parse(
                            output
                        )
                    );

                } catch {

                    resolve({
                        event:
                            "NORMAL",

                        confidence:
                            0.5,

                        source:
                            "fallback"
                    });
                }
            }
        );

        processPython.on(
            "error",
            () => {

                resolve({
                    event:
                        "NORMAL",

                    confidence:
                        0.5,

                    source:
                        "fallback"
                });
            }
        );
    });
}

module.exports = {
    predict
};