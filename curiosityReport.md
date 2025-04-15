
# 💡 Curiosity Report

My favorite deliverable in this class was deliverable 12. As aspiring software engineers, we spend so much time focusing on how our code should work, that we often become blindsided to the ways that malicious actors could exploit the vulnerabilities in our code to cause harm. Consequently, it's important that we don’t only consider how our code should be used, but we should also consider how it could be misused.

### CVE

In 1999, the Department of Homeland Security established the Common Vulnerabilities and Exposures (CVE)  list to provide a list of known information-security vulnerabilities to assist programmers in strengthening their code. The Mitre corporation maintains this list, and it can be accessed on their website; they even have a blog, podcast, and news website.<sup>1</sup> To test out their database, I searched for “SQL” in the CVE List.

It turns out there are currently 17,992 documented vulnerabilities related to SQL that the CVE list keeps track of. The most recent entry is CVE-2025-3589, and it was posted the day before I made this report on April 14, 2025.<sup>2</sup> These vulnerabilities include WordPress being vulnerable to SQL injection via the ‘printer_text’ parameter, and many examples of health code databases being vulnerable to SQL injection from improperly formatted search results. Clearly, there are numerous ways hackers may abuse SQL functionality for unintended purposes, so it’s essential that all DevOps engineers that manage code which interacts with SQL databases are mindful of the ways that the code could be misused to send injected code.

### CVSS

Some vulnerabilities are rather minor, but others can be catastrophic and result in billions of dollars in lost revenue or stolen information. The Common Vulnerability Scoring System acts as a technical standard to assess the severity of vulnerabilities. The scores range from 0 to 10, with 10 being the most severe.<sup>3</sup>  Their website contains a tool to help software engineers calculate how severe a potential vulnerability is to help them prioritize and put different vulnerabilities into a hierarchy. 

As an example, I put in a hypothetical attack that is performed over a network. It is a low complexity attack with no requirements or privileges required to carry it out. This hypothetical attack results in a high loss of integrity, availability, and confidentiality. The calculator rated it as a 9.3, meaning it would be an extremely critical attack.<sup>4</sup> Several other factors can decrease the threat level of an exploit. For instance, an extremely complicated attack is not considered to be as threatening because only advanced attackers could carry it out. Also, requiring privileges to carry out the exploit, or only being able to do it on site significantly reduces its threat level because attackers would need to put in greater efforts to attack under those circumstances.

### Summary

From the CVE List and the CVSS scoring system, I learned that there are ever increasing numbers of recognized attacks of varying complexities. There is no way to guarantee that your website isn’t vulnerable to hackers, so it’s essential that DevOps engineers learn from previous catastrophic attacks and that they attempt to carry similar attacks out on their own systems to determine if they are also vulnerable. And, if any problems are found in testing (or from actual attacks), it’s important to consider the impacts of the attack with a system such as CVSS to communicate how critical the issue is, resolve it, and help others avoid the same problems. 

---

# References

1. Mitre CVE website, https://cve.mitre.org/

2. Mitre CVE List for SQL Query, https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=SQL

3. CVSS Wikipedia Page, https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System

4. CVSS calculator, https://www.first.org/cvss/calculator/4-0

