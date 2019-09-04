import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {movies} from "./movies";
import {directors} from "./directors";


@Entity("movies_directors" ,{schema:"scoutbase" } )
@Index("movies_directors_FK",["movie",])
@Index("movies_directors_FK_1",["director",])
export class movies_directors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>movies, (movies: movies)=>movies.moviesDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'movie_id'})
    movie:movies | null;


   
    @ManyToOne(()=>directors, (directors: directors)=>directors.moviesDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'director_id'})
    director:directors | null;

}
