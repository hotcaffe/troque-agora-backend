import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Notice } from "./notice.entity";

@Entity('detalheTroca')
export class NoticeDetails {
    @PrimaryGeneratedColumn()
    id_detalheTroca?: number;

    @PrimaryColumn()
    id_usuarioAnuncio: number;

    @PrimaryColumn()
    id_anuncioTroca: number;

    @Column({length: 32, nullable: false})
    vc_titulo: string;

    @Column({length: 128, nullable: false})
    vc_conteudo: string;

    @ManyToOne(() => Notice, notice => notice.noticeDetails)
    @JoinColumn([{name: 'id_usuarioAnuncio', referencedColumnName: 'id_usuarioAnuncio'}, {name: 'id_anuncioTroca', referencedColumnName: 'id_anuncioTroca'}])
    notice: Notice;
}
