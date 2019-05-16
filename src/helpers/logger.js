/**
 * {Object} config
 * @prop {Boolean} toggle [Logger on/off]
 */
const config = {
	toggle: true
};
const COLORS = {
	RED: "\x1b[31m",
	GREEN: "\x1b[32m",
	YELLOW: "\x1b[33m",
	BLUE: "\x1b[34m",
	PURPLE: "\x1b[35m",
	WHITE: "\x1b[37m"
};

module.exports = (filename, color = "WHITE") => {
	let time = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
	return (head, body) => {
		if (config.toggle) {
			// {Object} msg [Message to log]
			let msg = {
				color: COLORS[color.toUpperCase()],
				prefix: `[${time}] ${filename}: `,
				head: head,
				body: body ? body : ""
			};
			console.log(
				COLORS["WHITE"] +
					msg.prefix +
					COLORS[color] +
					msg.head,
				msg.body
			);
		}
	};
};
