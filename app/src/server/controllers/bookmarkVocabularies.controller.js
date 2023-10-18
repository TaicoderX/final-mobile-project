const {BookmarkVocabulary, Vocabulary} = require('../models');

const createBookmarkVocabulary = async (req, res) => {
    const userId = req.user.data._id;
    const vocabularies = req.body;

    try {
        for(let vocabulary of vocabularies){
            const {vocabularyId} = vocabulary;
            
            const vocab = await Vocabulary.findById(vocabularyId);
            if (!vocab) {
                return res.status(404).json({ error: 'Vocabulary does not exist' });
            }

            const bookmarkVocab = await BookmarkVocabulary.findOne({userId, vocabularyId});
            if(bookmarkVocab){
                return res.status(400).json({error: 'Vocabulary is already bookmarked'});
            }

            const newBookmarkVocab = new BookmarkVocabulary({
                userId,
                vocabularyId
            });
            await newBookmarkVocab.save();
        }

        res.status(200).json({message: 'Bookmark vocabulary created successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const deleteBookmarkVocabulary = async (req, res) => {
    const userId = req.user.data._id;
    const vocabularyId = req.params.id || req.query.id;

    try {
        const bookmarkVocab = await BookmarkVocabulary.findOne({userId, vocabularyId});
        if(!bookmarkVocab){
            return res.status(404).json({error: 'Bookmark vocabulary not found'});
        }

        await bookmarkVocab.delete();

        res.status(200).json({message: 'Bookmark vocabulary deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createBookmarkVocabulary,
    deleteBookmarkVocabulary
}