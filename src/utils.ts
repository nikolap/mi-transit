function isNonBlankString(s: unknown) {
	return typeof s === "string" && s.trim() !== "";
}

function isValidInt(x: unknown) {
	return (
		typeof x === "number" || (typeof x === "string" && !isNaN(parseInt(x)))
	);
}

export { isNonBlankString, isValidInt };
