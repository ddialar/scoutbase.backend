import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("users" ,{ schema: process.env.ORM_DATABASE_NAME } )
@Index("users_username_IDX",["username",])
export class Users {

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
        length:20,
        name:"username"
        })
    username:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"password"
        })
    password:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"token"
        })
    token:string;
        
}
