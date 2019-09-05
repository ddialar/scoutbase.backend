import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {movies_actors} from "./movies_actors";
import {movies_directors} from "./movies_directors";


@Entity("movies" ,{schema:"scoutbase" } )
export class movies {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"title"
        })
    title:string;
        

    @Column("int",{ 
        nullable:false,
        name:"year"
        })
    year:number;
        

    @Column("double",{ 
        nullable:false,
        precision:22,
        name:"rating"
        })
    rating:number;
        

   
    @OneToMany(()=>movies_actors, (movies_actors: movies_actors)=>movies_actors.movie,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesActorss:movies_actors[];
    

   
    @OneToMany(()=>movies_directors, (movies_directors: movies_directors)=>movies_directors.movie,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesDirectorss:movies_directors[];
    
}
