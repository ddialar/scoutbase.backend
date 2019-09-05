import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {movies} from "./movies";
import {actors} from "./actors";


@Entity("movies_actors" ,{schema:"scoutbase" } )
@Index("movies_actors_FK",["movie",])
@Index("movies_actors_FK_1",["actor",])
export class movies_actors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>movies, (movies: movies)=>movies.moviesActorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'movie_id'})
    movie:movies | null;


   
    @ManyToOne(()=>actors, (actors: actors)=>actors.moviesActorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'actor_id'})
    actor:actors | null;

}
