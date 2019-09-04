import { getManager } from 'typeorm';
import { movies }     from '../models/entities/movies';

// const moviesRepository = getManager().getRepository(movies);

const getAllMovies = async () => {
    try {
        return await getManager().getRepository(movies).find();
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export {
    getAllMovies
}