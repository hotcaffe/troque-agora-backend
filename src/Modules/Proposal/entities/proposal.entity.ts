import { User } from "src/modules/User/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ProposalNotices } from "./proposalNotices.entity";
import { ProposalItem } from "./proposalItem.entity";

@Entity('propostaTroca')
export class Proposal {
    @PrimaryGeneratedColumn()
    id_propostaTroca: number
    
    @PrimaryColumn()
    id_usuarioProposta: number;
    
    @Column({length: 128, nullable: false})
    vc_titulo: string;

    @Column({length: 128, nullable: false})
    vc_descricao: string;

    @Column({type: 'boolean', nullable: false})
    bo_ativo: boolean;

    @ManyToOne(() => User, user => user.userProposals)
    @JoinColumn({name: 'id_usuarioProposta', referencedColumnName: 'id_usuario'})
    user?: User;

    @OneToMany(() => ProposalNotices, proposalNotices => proposalNotices.proposal)
    proposalNotices?: ProposalNotices[];

    @OneToMany(() => ProposalItem, proposalItem => proposalItem.proposal)
    proposalItems?: ProposalItem[];
}
