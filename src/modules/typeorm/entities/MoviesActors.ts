import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Movies} from "./Movies";
import {Actors} from "./Actors";


@Entity("movies_actors" ,{ schema: process.env.ORM_DATABASE_NAME } )
@Index("movies_actors_FK",["movie",])
@Index("movies_actors_FK_1",["actor",])
export class MoviesActors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>Movies, (movies: Movies)=>movies.moviesActorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'movie_id'})
    movie:Movies | null;


   
    @ManyToOne(()=>Actors, (actors: Actors)=>actors.moviesActorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'actor_id'})
    actor:Actors | null;

}
