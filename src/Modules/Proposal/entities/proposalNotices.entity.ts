import { Notice } from "src/Modules/notice/entities/notice.entity";
import { User } from "src/modules/user/entities/user.entity";
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
    @JoinColumn([{name: 'id_usuarioProposta', referencedColumnName: 'id_usuarioProposta'}, {name: 'id_propostaTroca', referencedColumnName: 'id_propostaTroca'}])
    proposal: Proposal;

    @ManyToOne(() => Notice, notice => notice.proposalNotices)
    @JoinColumn([{name: 'id_usuarioAnuncio', referencedColumnName: 'id_usuarioAnuncio'}, {name: 'id_anuncioTroca', referencedColumnName: 'id_anuncioTroca'}])
    notice: Notice;
}
