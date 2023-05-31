package com.example.loginTest;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "kakao_table")
public class LoginEntity {
    @Id
    @Column(name = "k_number")
    private long knumber;
    @Column(name = "k_name")
    private String kname;
    @Column(name = "k_email")
    private String kemail;

    public LoginEntity() {
    }

    public long getKnumber() {
        return knumber;
    }

    public void setKnumber(long knumber) {
        this.knumber = knumber;
    }

    public String getKname() {
        return kname;
    }

    public void setKname(String kname) {
        this.kname = kname;
    }

    public String getKemail() {
        return kemail;
    }

    public void setKemail(String kemail) {
        this.kemail = kemail;
    }

    // 생성자, 기타 메서드 생략
}
