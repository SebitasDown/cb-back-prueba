import { getAllComments, postComments, updateComments, deleteComments } from "./comments.model.js";

export const getComent = async (req, res) => {
    try {
        const {id_video} = req.query;
        if (!id_video) {
            return res.status(400).json({ error: 'id_video es requerido' });
        }
        const comments = await getAllComments(id_video);
        res.json(comments);
    } catch (error) {
        console.error('Error en getComent:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createComment = async (req, res) =>{
    try {
        const {id_user, id_video, comments} = req.body;
        if (!id_user || !id_video || !comments) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }
        const newComment = await postComments(id_user, id_video, comments);
        res.json(newComment);
    } catch (error) {
        console.error('Error en createComment:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const updateComent = async (req, res) => {
    try {
        console.log('🔍 UPDATE - req.params:', req.params);
        console.log('🔍 UPDATE - req.body:', req.body);
        
        const {id_comment} = req.params;
        const {comments, id_user} = req.body;
        
        if (!id_comment || !comments || !id_user) {
            console.log('❌ UPDATE - Validación fallida:', { id_comment, comments, id_user });
            return res.status(400).json({ error: 'id_comment, comments y id_user son requeridos' });
        }
        
        const updateCo = await updateComments(id_comment, req.body);
        res.json(updateCo);
    } catch (error) {
        console.error('Error en updateComent:', error);
        if (error.status === 403) {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        console.log('🔍 DELETE - req.params:', req.params);
        console.log('🔍 DELETE - req.body:', req.body);
        
        const {id_comment} = req.params;
        const {id_user} = req.body;
        
        if (!id_comment || !id_user) {
            console.log('❌ DELETE - Validación fallida:', { id_comment, id_user });
            return res.status(400).json({ error: 'id_comment y id_user son requeridos' });
        }
        
        await deleteComments(id_comment, id_user);
        res.json({message: "Comentario eliminado correctamente"});
    } catch (error) {
        console.error('Error en deleteComment:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

