import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {actors_directors} from "./actors_directors";
import {movies_actors} from "./movies_actors";


@Entity("actors" ,{schema:"scoutbase" } )
export class actors {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"name"
        })
    name:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:15,
        name:"birthday"
        })
    birthday:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"country"
        })
    country:string;
        

   
    @OneToMany(()=>actors_directors, (actors_directors: actors_directors)=>actors_directors.actor,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    actorsDirectorss:actors_directors[];
    

   
    @OneToMany(()=>movies_actors, (movies_actors: movies_actors)=>movies_actors.actor,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesActorss:movies_actors[];
    
}
