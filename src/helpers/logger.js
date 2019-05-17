/**
 * Simple logger that
 * seperates production
 * from development logs
 */
module.exports = name => {
	let env = process.env.NODE_ENV;
	return (content, production) => {
		if (content instanceof Error) {
			console.log(`${name}: ${env == "development" ? content : content.message}`);
		} else if (env == "development" || production) {
			console.log(`${name}: ${content}`)
		}
	};
};
