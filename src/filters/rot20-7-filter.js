module.exports = (text) => {
	return text.replace(/[a-zA-Z0-9]/g, (char) => {
		const code = char.charCodeAt(0);

		// ROT20 for uppercase letters (Decoding: shift by 26 - 20 = 6)
		if (code >= 65 && code <= 90) {
			return String.fromCharCode(((code - 65 + 6) % 26) + 65); // Changed +20 to +6
		}

		// ROT20 for lowercase letters (Decoding: shift by 26 - 20 = 6)
		if (code >= 97 && code <= 122) {
			return String.fromCharCode(((code - 97 + 6) % 26) + 97); // Changed +20 to +6
		}

		// ROT7 for digits (Decoding: shift by 10 - 7 = 3)
		if (code >= 48 && code <= 57) {
			return String.fromCharCode(((code - 48 + 3) % 10) + 48); // Changed +7 to +3
		}

		return char;
	});
}