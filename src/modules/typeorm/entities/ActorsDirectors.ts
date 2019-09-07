import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Actors} from "./Actors";
import {Directors} from "./Directors";


@Entity("actors_directors" ,{ schema: process.env.ORM_DATABASE_NAME } )
@Index("actors_directors_FK",["actor",])
@Index("actors_directors_FK_1",["director",])
export class ActorsDirectors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>Actors, (actors: Actors)=>actors.actorsDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'actor_id'})
    actor:Actors | null;


   
    @ManyToOne(()=>Directors, (directors: Directors)=>directors.actorsDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'director_id'})
    director:Directors | null;

}
