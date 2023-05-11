import { defineConfig } from "vite";
import zipPack from "vite-plugin-zip-pack";

export default defineConfig({
    root: "./src",
    base: "./",
    publicDir: false,
    server: {
        outDir: "../dist",
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
    plugins: [
        zipPack({
            inDir: "./dist",
            outDir: "./releases",
            outFileName: "release-" + process.env.npm_package_name + "-" + process.env.npm_package_version + ".zip",
        })
    ]
});
