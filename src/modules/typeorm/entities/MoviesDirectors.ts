import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Movies} from "./Movies";
import {Directors} from "./Directors";


@Entity("movies_directors" ,{schema:"scoutbase" } )
@Index("movies_directors_FK",["movie",])
@Index("movies_directors_FK_1",["director",])
export class MoviesDirectors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>Movies, (movies: Movies)=>movies.moviesDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'movie_id'})
    movie:Movies | null;


   
    @ManyToOne(()=>Directors, (directors: Directors)=>directors.moviesDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'director_id'})
    director:Directors | null;

}
