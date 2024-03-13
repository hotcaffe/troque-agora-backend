import { Notice } from "src/Modules/Notice/entities/notice.entity";
import { User } from "src/modules/User/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Proposal } from "./proposal.entity";

@Entity('propostaAnuncio')
export class ProposalNotices {
    @PrimaryColumn()
    id_usuarioAnuncio: number;

    @PrimaryColumn()
    id_anuncioTroca: number
    
    @PrimaryColumn()
    id_usuarioProposta: number;

    @PrimaryColumn()
    id_propostaTroca: number;
    
    @Column({length: 16, nullable: false})
    vc_status: string;

    @ManyToOne(() => Proposal, proposal => proposal.proposalNotices)
    @JoinColumn([{name: 'id_usuarioProposta'}, {name: 'id_propostaTroca'}])
    proposal: Proposal;

    @ManyToOne(() => Notice, notice => notice.proposalNotices)
    @JoinColumn([{name: 'id_usuarioAnuncio'}, {name: 'id_anuncioTroca'}])
    notice: Notice;
}
