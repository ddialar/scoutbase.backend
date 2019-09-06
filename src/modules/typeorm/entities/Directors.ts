import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {ActorsDirectors} from "./ActorsDirectors";
import {MoviesDirectors} from "./MoviesDirectors";


@Entity("directors" ,{schema:"scoutbase" } )
export class Directors {

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
        

   
    @OneToMany(()=>ActorsDirectors, (ActorsDirectors: ActorsDirectors)=>ActorsDirectors.director,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    actorsDirectorss:ActorsDirectors[];
    

   
    @OneToMany(()=>MoviesDirectors, (MoviesDirectors: MoviesDirectors)=>MoviesDirectors.director,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    moviesDirectorss:MoviesDirectors[];
    
}
