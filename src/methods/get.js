const { SourceBin } = require('../Structures');
const { resolveKey, fetch } = require('../util');

module.exports = async (key, options = {}) => {
    key = resolveKey(key);
    if (!key) throw new SyntaxError('Expected a valid bin key or url');

    const defaultOptions = {
        fetchContent: true,
    };

    options = Object.assign(defaultOptions, options);

    const binData = await fetch(`https://sourceb.in/api/bins/${key}`);
    if (!binData) throw new Error('There was a error in fetching bin data');

    if (options.fetchContent) {
        for (let i = 0; i < binData.files.length; i++) {
            const content = await fetch(
                `https://cdn.sourceb.in/bins/${key}/${i}`,
                {
                    responseType: 'text',
                },
            );

            if (!content)
                throw new Error(
                    'There was a error in fetching bin content for file ' + i,
                );

            binData.files[i] = {
                content,
                ...binData.files[i],
            };
        }
    }

    const Bin = new SourceBin(key, binData);

    return Bin;
};
