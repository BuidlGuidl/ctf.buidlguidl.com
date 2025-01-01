export const recipes = `
# Generate TypeScript ABIs for scripts package
generate-scripts-abis:
	node scripts-js/generateTsAbisForScripts.js`

export const postDeployRecipeToRun = "generate-scripts-abis"
