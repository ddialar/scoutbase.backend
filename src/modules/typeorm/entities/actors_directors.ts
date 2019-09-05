import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {actors} from "./actors";
import {directors} from "./directors";


@Entity("actors_directors" ,{schema:"scoutbase" } )
@Index("actors_directors_FK",["actor",])
@Index("actors_directors_FK_1",["director",])
export class actors_directors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>actors, (actors: actors)=>actors.actorsDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'actor_id'})
    actor:actors | null;


   
    @ManyToOne(()=>directors, (directors: directors)=>directors.actorsDirectorss,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'director_id'})
    director:directors | null;

}
