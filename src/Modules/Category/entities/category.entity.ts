import { Column, Entity, JoinColumn, ManyToOne, Not, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notice } from "src/modules/notice/entities/notice.entity";
import { ProposalItem } from "../../proposal/entities/proposalItem.entity";

@Entity('categoria')
export class Category {
    @PrimaryGeneratedColumn()
    id_categoria?: number;

    @Column({length: 32, nullable: false, unique: true})
    vc_titulo: string;

    @Column({length: 128, nullable: false})
    vc_descricao: string;

    @Column({type: 'boolean', nullable: false, default: true})
    bo_ativo: boolean;

    @OneToMany(() => Notice, notices => notices.category, {onDelete: 'RESTRICT'})
    notices?: Notice[];

    @OneToMany(() => ProposalItem, proposalItem => proposalItem.category, {onDelete: 'RESTRICT'})
    proposalItem?: ProposalItem[];
}
