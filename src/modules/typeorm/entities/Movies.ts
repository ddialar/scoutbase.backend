import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {MoviesActors} from "./MoviesActors";
import {MoviesDirectors} from "./MoviesDirectors";


@Entity("movies" ,{ schema: process.env.ORM_DATABASE_NAME } )
export class Movies {

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
        

   
    @OneToMany(()=>MoviesActors, (MoviesActors: MoviesActors)=>MoviesActors.movie,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesActorss:MoviesActors[];
    

   
    @OneToMany(()=>MoviesDirectors, (MoviesDirectors: MoviesDirectors)=>MoviesDirectors.movie,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesDirectorss:MoviesDirectors[];
    
}
